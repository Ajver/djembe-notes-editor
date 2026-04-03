const DEFAULT_VIEW = 'editor';

export const navigateTo = (view) => {
    const url = new URL(window.location);

    if (view === '') {
        view = DEFAULT_VIEW;
    }
    
    url.searchParams.set('v', view);
    window.history.pushState({}, '', url);
    
    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('viewChange'));
};

export const getCurrentView = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v') || DEFAULT_VIEW;
};