
import { createClient } from "@/app/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="container py-10 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 font-serif">User Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-1">
                        <label className="text-sm font-medium text-muted-foreground">User ID</label>
                        <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">
                            {user.id}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="text-lg font-medium">
                            {user.email}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                        <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                        <div className="text-sm">
                            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
