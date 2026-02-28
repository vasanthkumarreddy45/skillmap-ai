import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a career roadmap generator. Given a user's target company/domain, desired role, current skill level, and known programming languages, generate a personalized learning roadmap.

Return a JSON object with this structure:
{
  "title": "Roadmap title",
  "totalWeeks": number,
  "milestones": [
    {
      "label": "Milestone name",
      "description": "What to learn",
      "duration": "Week X-Y",
      "status": "upcoming",
      "topics": ["topic1", "topic2"]
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"]
}

Make it realistic, specific to the role, and progressive from fundamentals to advanced topics. Include 6-8 milestones.`;

    const userMessage = `Target Company/Domain: ${userProfile.company}
Desired Role: ${userProfile.role}
Current Skill Level: ${userProfile.existingSkills}
Known Programming Languages: ${Array.isArray(userProfile.languages) ? userProfile.languages.join(", ") : userProfile.languages}

Generate a personalized learning roadmap for this user.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_roadmap",
              description: "Create a learning roadmap for the user",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  totalWeeks: { type: "number" },
                  milestones: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        description: { type: "string" },
                        duration: { type: "string" },
                        status: { type: "string", enum: ["done", "current", "upcoming"] },
                        topics: { type: "array", items: { type: "string" } },
                      },
                      required: ["label", "description", "duration", "status", "topics"],
                    },
                  },
                  recommendations: { type: "array", items: { type: "string" } },
                },
                required: ["title", "totalWeeks", "milestones", "recommendations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_roadmap" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let roadmap;
    if (toolCall) {
      roadmap = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try parsing content
      const content = data.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      roadmap = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!roadmap) throw new Error("Failed to parse roadmap");

    return new Response(JSON.stringify(roadmap), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-roadmap error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
