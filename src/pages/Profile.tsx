import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function Profile() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      setEmail(payload?.email || '');
    }
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      setSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="rounded-lg bg-muted/50 p-6 flex flex-col items-center">
                <span className="font-semibold text-lg">Logged in as</span>
                <div className="mt-2 text-xl font-bold text-primary">{email}</div>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="text-lg font-semibold">Change Password</div>
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium">Old Password</label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Enter old password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm New Password</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Confirm new password"
                  />
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                {success && <div className="text-green-600 text-sm text-center">{success}</div>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 