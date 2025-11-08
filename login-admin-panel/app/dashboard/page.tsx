"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import {
  ClipboardList,
  User as UserIcon,
  Lock,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!user) {
        router.push("/");
      } else {
        setUser(user);
        setSessionInfo(session);
      }
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">User Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Welcome!</p>
            <h2 className="text-2xl font-semibold">
              {user.user_metadata.full_name || "User"}
            </h2>
          </div>

          <div className="space-y-4 rounded-lg bg-muted p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Basic Information
            </h3>

            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg">{user.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="text-sm font-mono break-all">{user.id}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Verified
                </p>
                <p className="text-lg">
                  {user.email_confirmed_at ? "Yes" : "No"}
                </p>
                {user.email_confirmed_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Verified:{" "}
                    {new Date(user.email_confirmed_at).toLocaleString("en-US")}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Account Created
                </p>
                <p className="text-lg">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {user.updated_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="text-lg">
                    {new Date(user.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {user.user_metadata && Object.keys(user.user_metadata).length > 0 && (
            <div className="space-y-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Additional Data
              </h3>
              <div className="grid gap-3">
                {Object.entries(user.user_metadata).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-base">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sessionInfo && (
            <div className="space-y-4 rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Session
              </h3>
              <div className="grid gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Session Status
                  </p>
                  <p className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Active
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Expires At
                  </p>
                  <p className="text-base">
                    {new Date(sessionInfo.expires_at! * 1000).toLocaleString(
                      "en-US"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Provider
                  </p>
                  <p className="text-base capitalize">
                    {user.app_metadata.provider || "email"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
