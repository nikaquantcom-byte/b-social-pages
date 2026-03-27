import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // Verify authorization
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const now = new Date().toISOString();

  // 1. Mark past events as 'ended'
  const { data: ended, error: endError } = await supabase
    .from('events')
    .update({ status: 'ended' })
    .lt('date', now)
    .eq('status', 'active')
    .select('id');

  if (endError) {
    console.error('[cleanup-old-events] Error marking events as ended:', endError);
  } else {
    console.log(`[cleanup-old-events] Marked ${ended?.length ?? 0} event(s) as 'ended'.`);
  }

  // 2. Hard-delete import events that have been 'ended' for 30+ days.
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: deleted, error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('status', 'ended')
    .lt('date', thirtyDaysAgo.toISOString())
    .eq('source', 'import')
    .select('id');

  if (deleteError) {
    console.error('[cleanup-old-events] Error deleting old import events:', deleteError);
  } else {
    console.log(`[cleanup-old-events] Deleted ${deleted?.length ?? 0} old import event(s).`);
  }

  const responseBody = {
    success: !endError && !deleteError,
    events_ended: ended?.length ?? 0,
    events_deleted: deleted?.length ?? 0,
    errors: {
      endError: endError ?? null,
      deleteError: deleteError ?? null,
    },
    timestamp: now,
  };

  return new Response(JSON.stringify(responseBody), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
