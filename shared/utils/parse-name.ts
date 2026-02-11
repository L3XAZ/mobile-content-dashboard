export const parseName = (fullName: string): { firstName: string; lastName: string } => {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }
  return {
    firstName: trimmed.substring(0, spaceIndex),
    lastName: trimmed.substring(spaceIndex + 1),
  };
};
