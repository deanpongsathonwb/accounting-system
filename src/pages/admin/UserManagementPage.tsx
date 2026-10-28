import React, { useState } from 'react';
import { Plus, Search, Filter, UserCheck } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { EmptyState, Modal } from '../../components/feedback/index.ts';
import { CustomSelect } from '../../components/common/index.ts';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { User, UserRole } from '../../types/common.types.ts';
import { sanitizeInput } from '../../utils/security.ts';
import imagesSeed from '../../seed/images.json';

export const UserManagementPage: React.FC = () => {
  const users = useAppStore((state) => state.users);
  const addUser = useAppStore((state) => state.addUser);
  const addAuditLog = useAppStore((state) => state.addAuditLog);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('accountant');

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFullName = sanitizeInput(fullName);
    const cleanUsername = sanitizeInput(username);
    const cleanEmail = sanitizeInput(email);

    if (!cleanFullName || !cleanUsername || !cleanEmail) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      fullName: cleanFullName,
      email: cleanEmail,
      role,
      avatarKey: 'default',
      status: 'active',
      lastLogin: UI.common.emptyValue
    };

    addUser(newUser);
    if (currentUser) {
      addAuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: currentUser.fullName,
        role: currentUser.role,
        actionType: UI.common.create,
        entity: `${UI.admin.usersTitle}: ${cleanUsername} (${role})`,
        ipAddress: 'Web Client (Admin Session)'
      });
    }

    setIsModalOpen(false);
    setFullName('');
    setUsername('');
    setEmail('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.admin.usersTitle}
        subtitle={UI.admin.usersSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={UI.common.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="user-role-filter" className="sr-only">
                {UI.common.filter}
              </label>
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                id="user-role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label={UI.common.filter}
                className="w-full sm:w-auto text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">{UI.common.all}</option>
                <option value="accountant">{UI.roles.accountant.title}</option>
                <option value="finance">{UI.roles.finance.title}</option>
                <option value="auditor">{UI.roles.auditor.title}</option>
                <option value="admin">{UI.roles.admin.title}</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.admin.newUser}</span>
          </button>
        </div>

        {/* Users Table & Stacked Cards */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title={UI.feedback.noData}
                subtitle={UI.feedback.noDataSubtitle}
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{UI.admin.fullName}</th>
                      <th className="py-3 px-4">{UI.auth.usernameLabel}</th>
                      <th className="py-3 px-4">{UI.admin.email}</th>
                      <th className="py-3 px-4">{UI.admin.role}</th>
                      <th className="py-3 px-4">{UI.admin.lastLogin}</th>
                      <th className="py-3 px-4 text-center">{UI.common.status}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((u) => {
                      const avatar =
                        imagesSeed.avatars[u.avatarKey as keyof typeof imagesSeed.avatars] ||
                        imagesSeed.avatars.default;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={avatar}
                                alt={u.fullName}
                                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <span className="font-semibold text-slate-900">{u.fullName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{u.username}</td>
                          <td className="py-3.5 px-4 text-slate-600 text-xs">{u.email}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              {UI.roles[u.role].title}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">{u.lastLogin}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                              <span>{UI.common.active}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {filtered.map((u) => {
                  const avatar =
                    imagesSeed.avatars[u.avatarKey as keyof typeof imagesSeed.avatars] ||
                    imagesSeed.avatars.default;

                  return (
                    <div key={u.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatar}
                            alt={u.fullName}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm break-words">{u.fullName}</h4>
                            <span className="font-mono text-xs text-slate-500 block">@{u.username}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>{UI.common.active}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-50">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {UI.roles[u.role].title}
                        </span>
                        <span className="text-slate-500 text-[11px] font-mono">{u.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {UI.admin.lastLogin}: {u.lastLogin}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* New User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={UI.admin.newUser}
        icon={<UserCheck className="w-5 h-5 text-blue-600" />}
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 max-w-full">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.admin.fullName}
            </label>
            <input
              type="text"
              required
              placeholder={UI.admin.fullName}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.auth.usernameLabel}
            </label>
            <input
              type="text"
              required
              placeholder={UI.auth.usernameLabel}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.admin.email}
            </label>
            <input
              type="email"
              required
              placeholder={UI.admin.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.admin.role}
            </label>
            <CustomSelect
              value={role}
              onChange={(val) => setRole(val as UserRole)}
              options={[
                { value: 'accountant', label: UI.roles.accountant.title },
                { value: 'finance', label: UI.roles.finance.title },
                { value: 'auditor', label: UI.roles.auditor.title },
                { value: 'admin', label: UI.roles.admin.title }
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {UI.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
            >
              {UI.common.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
