function(instance, properties, context) {
    if (instance.data.isInitialized) {
        return;
    }

    instance.data.uniqueNumber = crypto.randomUUID();
    const root = instance.canvas.get(0);

    const wrapper = document.createElement('div');
    wrapper.className = 'dynamic-icon-pro-wrapper'; // General class for the wrapper
    instance.data.wrapperElement = wrapper;

    root.innerHTML = '';
    root.appendChild(wrapper);

    wrapper.addEventListener('click', () => {
        if (!instance.data._is_not_clickable_cached) {
            instance.triggerEvent("clicked", null);
        }
    });

    instance.data.iconElement = null; // No icon element initially
    instance.data._is_not_clickable_cached = properties.is_not_clickable; // Use initial properties

    instance.data.isInitialized = true;
}