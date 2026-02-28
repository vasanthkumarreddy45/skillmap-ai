import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
        const { user_id, content } = await req.json();
        const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

        // Gemini API call
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `System: You are an AI assistant for SkillMap AI, a professional career guidance and skill-building application. Your goal is to help users understand their learning roadmaps, explain complex technical topics, and provide encouragement. Be concise, professional, and helpful. Always refer to the user's career goals if mentioned.\n\nUser: ${content}`,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

        // Store AI response in the database
        const { error: insertError } = await supabase.from("messages").insert({
            user_id,
            content: aiResponse,
            role: "assistant",
        });

        if (insertError) throw insertError;

        return new Response(JSON.stringify({ content: aiResponse }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Chat error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
