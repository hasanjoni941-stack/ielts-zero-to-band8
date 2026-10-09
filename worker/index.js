export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = "https://hasanjoni941-stack.github.io";
    const cors = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    const url = new URL(request.url);
    if (url.pathname !== "/api/feedback") {
      return Response.json({ error: "Not found" }, { status: 404, headers: cors });
    }
    if (origin && origin !== allowedOrigin) {
      return Response.json({ error: "Origin not allowed" }, { status: 403, headers: cors });
    }
    if (request.method !== "POST") {
      return Response.json({ error: "Use POST" }, { status: 405, headers: cors });
    }

    try {
      const body = await request.json();
      const essay = typeof body.essay === "string" ? body.essay.trim() : "";
      const task = ["Academic Task 1", "Task 2", "General Training Task 1", "General practice"].includes(body.task)
        ? body.task : "General practice";
      if (essay.length < 30) {
        return Response.json({ error: "কমপক্ষে ৩০টি অক্ষরের লেখা দিন।" }, { status: 400, headers: cors });
      }
      if (essay.length > 8000) {
        return Response.json({ error: "লেখা ৮,০০০ অক্ষরের মধ্যে রাখুন।" }, { status: 413, headers: cors });
      }

      const prompt = `You are a supportive IELTS writing tutor for Bengali-speaking learners. Review the student's writing for the selected task: ${task}.
Give practical educational feedback, not an official IELTS score or guarantee. Use Bengali for explanations and English for corrected examples.
Structure your response with these headings:
1) Overall impression
2) Task response / task achievement
3) Coherence and cohesion
4) Vocabulary
5) Grammar accuracy and range
6) Three priority fixes with examples
7) A short improved sample using the student's ideas
If the task type or prompt is missing, state what additional context is needed. Do not claim a precise official band score; at most provide a cautious estimated range and clearly label it non-official. Be respectful and specific.
Student writing:
${essay}`;

      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
        messages: [
          { role: "system", content: "You are an IELTS writing tutor. Never claim to be an official IELTS examiner. Avoid fabricating a score." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1200
      });
      const feedback = result?.response || result?.output_text || "";
      if (!feedback) {
        return Response.json({ error: "AI থেকে উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।" }, { status: 502, headers: cors });
      }
      return Response.json({ feedback }, { headers: { ...cors, "Cache-Control": "no-store" } });
    } catch (error) {
      return Response.json({ error: "এই মুহূর্তে feedback তৈরি করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।" }, { status: 500, headers: cors });
    }
  }
};