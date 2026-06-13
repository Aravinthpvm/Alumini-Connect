export const getInitials = (name = '') => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
};

export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(dateStr);
};

export const truncate = (str = '', len = 100) =>
    str.length > len ? str.slice(0, len) + '…' : str;

export const statusColor = (status) => {
    const map = {
        ACTIVE: 'success', VERIFIED: 'success', ACCEPTED: 'success', SHORTLISTED: 'success', COMPLETED: 'success',
        PENDING: 'warning', UNDER_REVIEW: 'warning', UPCOMING: 'info',
        DECLINED: 'danger', REJECTED: 'danger', CLOSED: 'danger', CANCELLED: 'danger',
        APPLIED: 'primary', ONLINE: 'info', OFFLINE: 'ghost',
    };
    return map[status] || 'ghost';
};

export const jobTypeBadge = (type) => {
    const map = { FULL_TIME: 'Full Time', INTERNSHIP: 'Internship', CONTRACT: 'Contract', PART_TIME: 'Part Time' };
    return map[type] || type;
};

export const extractError = (err) =>
    err?.response?.data?.message || err?.message || 'Something went wrong';
