const instagramContentUrlPattern = /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?(?:\?[^\s]*)?$/i;

export const isInstagramContentUrl = (url?: string | null) => {
  if (!url) {
    return false;
  }

  return instagramContentUrlPattern.test(url.trim());
};

export const getInstagramEmbedUrl = (url?: string | null) => {
  if (!isInstagramContentUrl(url)) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    const contentType = segments[0];
    const contentId = segments[1];

    if (!contentType || !contentId) {
      return null;
    }

    return `https://www.instagram.com/${contentType}/${contentId}/embed/captioned/`;
  } catch (error) {
    return null;
  }
};
