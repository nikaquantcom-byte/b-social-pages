-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Messaging tables + RLS, and profiles public-read policy
-- Date: 2026-03-28
-- Purpose: Fix messaging system (conversations, participants, messages) and
--          allow authenticated users to search/view other user profiles.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Profiles: allow authenticated users to view other profiles ─────────────
-- Without this policy the user search in Beskeder returns no results because
-- RLS blocks reading rows where id != auth.uid().
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'profiles_select_authenticated'
  ) THEN
    CREATE POLICY "profiles_select_authenticated"
      ON public.profiles
      FOR SELECT
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Make sure RLS is enabled on profiles (it may already be)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ── 2. conversations table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.conversations (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL    DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- A user can see conversations they participate in
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'conversations'
      AND policyname = 'conversations_select_participant'
  ) THEN
    CREATE POLICY "conversations_select_participant"
      ON public.conversations
      FOR SELECT
      USING (
        id IN (
          SELECT conversation_id
          FROM public.conversation_participants
          WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Any authenticated user can insert a new conversation row
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'conversations'
      AND policyname = 'conversations_insert_authenticated'
  ) THEN
    CREATE POLICY "conversations_insert_authenticated"
      ON public.conversations
      FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- ── 3. conversation_participants table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES public.profiles(id)      ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- A user can see participant rows for conversations they are in
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'conversation_participants'
      AND policyname = 'conv_participants_select_participant'
  ) THEN
    CREATE POLICY "conv_participants_select_participant"
      ON public.conversation_participants
      FOR SELECT
      USING (
        conversation_id IN (
          SELECT cp.conversation_id
          FROM public.conversation_participants cp
          WHERE cp.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Any authenticated user can insert participant rows (needed for startConversation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'conversation_participants'
      AND policyname = 'conv_participants_insert_authenticated'
  ) THEN
    CREATE POLICY "conv_participants_insert_authenticated"
      ON public.conversation_participants
      FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- ── 4. messages table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       uuid        NOT NULL REFERENCES public.profiles(id)      ON DELETE CASCADE,
  content         text        NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
  ON public.messages (conversation_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- A user can read messages in conversations they participate in
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'messages'
      AND policyname = 'messages_select_participant'
  ) THEN
    CREATE POLICY "messages_select_participant"
      ON public.messages
      FOR SELECT
      USING (
        conversation_id IN (
          SELECT conversation_id
          FROM public.conversation_participants
          WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- A user can insert messages into conversations they participate in
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'messages'
      AND policyname = 'messages_insert_participant'
  ) THEN
    CREATE POLICY "messages_insert_participant"
      ON public.messages
      FOR INSERT
      WITH CHECK (
        auth.uid() = sender_id
        AND conversation_id IN (
          SELECT conversation_id
          FROM public.conversation_participants
          WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Enable realtime for messages so live subscriptions work
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
