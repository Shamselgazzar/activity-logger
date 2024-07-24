// helper functions

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
  };
  return new Date(dateString).toLocaleString('en-US', options);
};

