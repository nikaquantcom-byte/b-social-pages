import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

interface JoinContextType {
  joinEvent: (id: string, name?: string) => void;
  leaveEvent: (id: string) => void;
  isJoined: (id: string) => boolean;
}

const JoinContext = createContext<JoinContextType>({
  joinEvent: () => {},
  leaveEvent: () => {},
  isJoined: () => false,
});

export function JoinProvider({ children }: { children: ReactNode }) {
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const joinEvent = useCallback((id: string, name?: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    toast({
      title: "Du er tilmeldt!",
      description: name ? `Vi ses til ${name}` : "Vi ses!",
    });
  }, []);

  const leaveEvent = useCallback((id: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast({
      title: "Afmeldt",
      description: "Du er ikke længere tilmeldt",
    });
  }, []);

  const isJoined = useCallback(
    (id: string) => joinedIds.has(id),
    [joinedIds],
  );

  return (
    <JoinContext.Provider value={{ joinEvent, leaveEvent, isJoined }}>
      {children}
    </JoinContext.Provider>
  );
}

export function useJoin() {
  return useContext(JoinContext);
}
