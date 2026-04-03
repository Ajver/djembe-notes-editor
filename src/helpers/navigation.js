// Navigation utility for URL parameter-based routing
export const navigateTo = (view) => {
    const url = new URL(window.location);

    if (view === '') {
        view = 'login';
    }
    
    url.searchParams.set('v', view);
    window.history.pushState({}, '', url);
    
    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('viewChange'));
};

export const getCurrentView = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v') || 'login';
};