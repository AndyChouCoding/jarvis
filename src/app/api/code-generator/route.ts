import { codeAgent } from "@/agents/code-agent";
import { Runner, InMemorySessionService } from "@google/adk";

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    
    // Initialize session service
    const sessionService = new InMemorySessionService();
    // Use provided sessionId or default if missing (though client should send it)
    const finalSessionId = sessionId || "session-code-gen-default";
    await sessionService.createSession({ appName: "jarvis", sessionId: finalSessionId, userId: "user-1" });

    const runner = new Runner({
        appName: "jarvis",
        agent: codeAgent,
        sessionService: sessionService,
    });

    const iterator = runner.runAsync({
        userId: "user-1",
        sessionId: finalSessionId,
        newMessage: { role: "user", parts: [{ text: message }] } as any,
    });

    let lastResponse = "";
    
    for await (const event of iterator) {
        // @ts-ignore
        if ((event as any).errorCode) {
            // @ts-ignore
            lastResponse = `Error: ${(event as any).errorMessage}`;
        }
        // @ts-ignore
        else if (event.content?.parts) {
            // @ts-ignore
            const text = event.content.parts.map((p: any) => p.text).join("");
            if (text) {
                lastResponse = text;
            }
        }
    }

    if (!lastResponse) {
       lastResponse = "Response received (check server logs for details if empty)";
    }

    return Response.json({ response: lastResponse });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate code" }, { status: 500 });
  }
}
