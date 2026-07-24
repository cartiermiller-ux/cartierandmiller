import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { users } = useStore();

  const handleLogin = () => {
    setLoading(true);
    const user = users.find(u => u.username === username && u.enabled);
    if (user && (password === "admin123" || password === "")) {
      useStore.setState({ currentUser: username });
      toast.success(`欢迎，${username}`);
      navigate("/");
    } else {
      toast.error("用户名/密码错误 (demo密码: admin123)");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-3xl">CM</div>
          <h1 className="text-3xl font-bold mt-6">Cartier & Miller</h1>
          <p className="text-muted-foreground">协议号运营管理平台</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label>用户名</Label>
            <Input value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin 或 seat1" />
          </div>
          <div>
            <Label>密码</Label>
            <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="admin123" />
          </div>
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">Demo: admin（全部） / seat1（仅聊天+任务）</p>
      </Card>
    </div>
  );
}
