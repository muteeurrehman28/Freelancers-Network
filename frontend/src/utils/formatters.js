import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Format date to readable string (e.g., "Jan 1, 2023")
export const formatDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

// Format date to include time (e.g., "Jan 1, 2023 14:30")
export const formatDateTime = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d, yyyy HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
};

// Format date as relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Unknown time';
  }
};

// Format currency (e.g., "$100")
export const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return '$0';
  }
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Extract first characters from name for avatar (e.g., "John Doe" -> "JD")
export const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return name.substring(0, 2).toUpperCase();
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

// Format skills list to string (e.g., ["React", "Node.js", "MongoDB"] -> "React, Node.js, MongoDB")
export const formatSkillsList = (skills, limit = 0) => {
  if (!skills || !Array.isArray(skills) || skills.length === 0) return '';
  if (limit > 0 && skills.length > limit) {
    return `${skills.slice(0, limit).join(', ')} +${skills.length - limit} more`;
  }
  return skills.join(', ');
};

// Format job status
export const formatJobStatus = (status) => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
};

// Format application status
export const formatApplicationStatus = (status) => {
  const statusColors = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'error',
  };
  
  return {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color: statusColors[status] || 'default',
  };
}; 