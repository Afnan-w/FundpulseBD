export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Placeholder endpoint: logs the signup and returns success.
    // No data is stored persistently. Wire up a real provider here.
    // eslint-disable-next-line no-console
    console.log("[newsletter] signup:", { name, email });

    return new Response(
      JSON.stringify({ ok: true, message: "Subscribed (placeholder)" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Signup failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
