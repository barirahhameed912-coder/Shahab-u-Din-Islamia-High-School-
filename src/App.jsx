import React, { useState, useEffect, useCallback } from "react";
import {
  Users, GraduationCap, Wallet, ClipboardCheck, Bell, CheckCircle2,
  XCircle, School, LogOut, Loader2, AlertCircle,
} from "lucide-react";

const SUPABASE_URL = "https://nirvegkckfkoavzeygdr.supabase.co";
const SUPABASE_KEY = "sb_publishable_G_1bm88TmeTpcfReTyHFNg_E_oR7kh2";

async function supabaseAuth(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Login failed");
  return data;
}

async function supabaseSelect(table, accessToken, query = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${query}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Failed to load ${table}`);
  return res.json();
}

async function supabaseUpdate(table, accessToken, match, patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${match}`, {
    method: "PATCH",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update ${table}`);
  return res.json();
}

async function supabaseInsert(table, accessToken, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Failed to insert into ${table}`);
  return res.json();
}

const ROLE_META = {
  principal: { label: "Principal", icon: School, accent: "#1E8E5A", accentSoft: "#E7F5EE" },
  teacher: { label: "Teacher", icon: ClipboardCheck, accent: "#1E63C9", accentSoft: "#E9F1FC" },
  parent: { label: "Parent", icon: Users, accent: "#7A3FC9", accentSoft: "#F1EAFB" },
  student: { label: "Student", icon: GraduationCap, accent: "#D98A15", accentSoft: "#FDF2E1" },
};

function StatCard({ icon: Icon, label, value, accent, accentSoft }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 3px rgba(14,42,84,0.08)", border: "1px solid #EEF1F6", flex: "1 1 160px", minWidth: 150 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: accentSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <Icon size={20} color={accent} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#0E2A54" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#6B7488", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #EEF1F6", boxShadow: "0 1px 3px rgba(14,42,84,0.06)", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0E2A54", margin: "0 0 12px 0" }}>{children}</h3>;
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await supabaseAuth(email, password);
      onLogin(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0E2A54 0%, #163B72 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0E2A54", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>SIS</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0E2A54", lineHeight: 1.3 }}>Shahab-ud-Din Islamia High School</div>
            <div style={{ fontSize: 11, color: "#6B7488" }}>Mundeke Goraya</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #E1E5EC", fontSize: 14 }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #E1E5EC", fontSize: 14 }} />
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C23B3B", fontSize: 12.5 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <button onClick={handleSubmit} disabled={loading || !email || !password} style={{ marginTop: 6, padding: "12px", borderRadius: 10, border: "none", background: loading ? "#94A3B8" : "#0E2A54", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <p style={{ fontSize: 11.5, color: "#9AA2B2", marginTop: 18, textAlign: "center" }}>Use the login provided by your school administrator.</p>
      </div>
    </div>
  );
}

function PrincipalPanel({ accessToken }) {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, t, c, f] = await Promise.all([
          supabaseSelect("students", accessToken),
          supabaseSelect("teachers", accessToken),
          supabaseSelect("classes", accessToken),
          supabaseSelect("fees", accessToken),
        ]);
        setStudents(s); setTeachers(t); setClasses(c); setFees(f);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  const paidTotal = fees.filter((f) => f.paid).reduce((sum, f) => sum + Number(f.amount), 0);

  if (loading) return <LoadingBlock />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard icon={Users} label="Total Students" value={students.length} accent="#1E8E5A" accentSoft="#E7F5EE" />
        <StatCard icon={GraduationCap} label="Total Teachers" value={teachers.length} accent="#1E8E5A" accentSoft="#E7F5EE" />
        <StatCard icon={Wallet} label="Fees Collected" value={`Rs. ${paidTotal.toLocaleString()}`} accent="#1E8E5A" accentSoft="#E7F5EE" />
        <StatCard icon={ClipboardCheck} label="Classes" value={classes.length} accent="#1E8E5A" accentSoft="#E7F5EE" />
      </div>
      <Card>
        <SectionTitle>Students</SectionTitle>
        {students.length === 0 ? (
          <EmptyNote text="No students added yet. Add some from Table Editor in Supabase." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {students.map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, background: "#FAFBFD", fontSize: 13.5, color: "#0E2A54" }}>
                <span>{s.name}</span>
                <span style={{ color: "#6B7488" }}>{s.roll_number || "-"}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function TeacherPanel({ accessToken }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    try {
      const s = await supabaseSelect("students", accessToken);
      const a = await supabaseSelect("attendance", accessToken, `&date=eq.${today}`);
      const map = {};
      a.forEach((row) => { map[row.student_id] = row; });
      setStudents(s);
      setAttendance(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [accessToken, today]);

  useEffect(() => { load(); }, [load]);

  const toggleAttendance = async (studentId) => {
    setSaving(true);
    try {
      const existing = attendance[studentId];
      if (existing) {
        await supabaseUpdate("attendance", accessToken, `id=eq.${existing.id}`, { present: !existing.present });
        setAttendance((prev) => ({ ...prev, [studentId]: { ...existing, present: !existing.present } }));
      } else {
        const [created] = await supabaseInsert("attendance", accessToken, { student_id: studentId, date: today, present: true });
        setAttendance((prev) => ({ ...prev, [studentId]: created }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock />;

  const presentCount = students.filter((s) => attendance[s.id]?.present).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard icon={Users} label="Total Students" value={students.length} accent="#1E63C9" accentSoft="#E9F1FC" />
        <StatCard icon={CheckCircle2} label="Marked Present" value={presentCount} accent="#1E63C9" accentSoft="#E9F1FC" />
      </div>
      <Card>
        <SectionTitle>Mark Today's Attendance ({today})</SectionTitle>
        {students.length === 0 ? (
          <EmptyNote text="No students found. Add students from Table Editor in Supabase." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {students.map((s) => {
              const rec = attendance[s.id];
              const isPresent = rec ? rec.present : null;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: "#FAFBFD", border: "1px solid #EEF1F6" }}>
                  <span style={{ fontSize: 14, color: "#0E2A54" }}>{s.name}</span>
                  <button onClick={() => toggleAttendance(s.id)} disabled={saving} style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", color: isPresent ? "#1E8E5A" : isPresent === false ? "#C23B3B" : "#6B7488", background: isPresent ? "#E7F5EE" : isPresent === false ? "#FBEBEB" : "#F0F2F6" }}>
                    {isPresent === null ? "Mark" : isPresent ? "Present" : "Absent"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function ParentStudentPanel({ accessToken }) {
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, n] = await Promise.all([
          supabaseSelect("students", accessToken),
          supabaseSelect("notifications", accessToken, "&order=created_at.desc&limit=10"),
        ]);
        setStudents(s);
        setNotifications(n);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  if (loading) return <LoadingBlock />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <SectionTitle>Students on Record</SectionTitle>
        {students.length === 0 ? (
          <EmptyNote text="No students found yet." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {students.map((s) => (
              <div key={s.id} style={{ fontSize: 13.5, color: "#0E2A54", padding: "8px 10px", background: "#FAFBFD", borderRadius: 8 }}>
                {s.name} {s.roll_number ? `— Roll ${s.roll_number}` : ""}
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card>
        <SectionTitle>Notifications</SectionTitle>
        {notifications.length === 0 ? (
          <EmptyNote text="No notifications yet." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Bell size={16} color="#7A3FC9" style={{ marginTop: 3, flexShrink: 0 }} />
                <div style={{ fontSize: 13.5, color: "#0E2A54" }}>{n.title}{n.message ? ` — ${n.message}` : ""}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function LoadingBlock() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: "#6B7488", gap: 8 }}>Loading live data...</div>;
}

function EmptyNote({ text }) {
  return <p style={{ fontSize: 13, color: "#9AA2B2", textAlign: "center", padding: "20px 0" }}>{text}</p>;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [profileError, setProfileError] = useState("");

  const handleLogin = async (data) => {
    setSession(data);
    try {
      const profiles = await supabaseSelect("profiles", data.access_token, `&id=eq.${data.user.id}`);
      if (profiles.length === 0) {
        setProfileError("No role assigned to this account yet. Ask your admin to add you to the profiles table.");
      } else {
        setRole(profiles[0].role);
      }
    } catch (e) {
      setProfileError(e.message);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setRole(null);
    setProfileError("");
  };

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (profileError) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#F5F7FA", fontFamily: "'Inter', sans-serif" }}>
        <Card style={{ maxWidth: 360, textAlign: "center" }}>
          <AlertCircle size={28} color="#C23B3B" style={{ marginBottom: 10 }} />
          <p style={{ fontSize: 14, color: "#0E2A54" }}>{profileError}</p>
          <button onClick={handleLogout} style={{ marginTop: 14, padding: "10px 18px", borderRadius: 8, border: "none", background: "#0E2A54", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Back to login</button>
        </Card>
      </div>
    );
  }

  const meta = ROLE_META[role] || ROLE_META.student;
  const RoleIcon = meta.icon;

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#F5F7FA", minHeight: "100vh", padding: "0 0 40px 0" }}>
      <div style={{ background: "linear-gradient(135deg, #0E2A54 0%, #163B72 100%)", padding: "22px 20px 44px 20px", borderRadius: "0 0 28px 28px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: meta.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RoleIcon size={20} color={meta.accent} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>Shahab-ud-Din Islamia High School</div>
              <div style={{ fontSize: 12, color: "#B9C6DE" }}>{meta.label} Dashboard · Live Data</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1
