document.addEventListener('DOMContentLoaded', ()=>{
    // DOM Elements
    const heroSlideFromLeftElements = document.querySelectorAll('#section-hero .slide-from-left-element');
    const featureSlideFromLeftElements = document.querySelectorAll('#section-feature .slide-from-left-element');
    const teamSlideFromLeftElements = document.querySelectorAll('#section-team .slide-from-left-element');
    const formSlideFromLeftElements = document.querySelectorAll('#form-wrapper .slide-from-left-element');
    const headerElement = document.querySelector('header');
    const spotlightElement = headerElement.querySelector('#spotlight');
//   setup intersection observers
    const observerSlideLeftElement = new IntersectionObserver((entries) =>{
        for(let entry of entries){
            if(entry.intersectionRatio > 0 ){
                entry.target.classList.add('slide-from-left');
                //force the first feature to slide in as well
                if(entry.target.classList.contains('feature')){
                    document.querySelectorAll('.feature')[0].classList.add('slide-from-left');
                }

            }
        }
    });

    for(let el of heroSlideFromLeftElements){
        observerSlideLeftElement.observe(el);
    }
    for(let el of featureSlideFromLeftElements){
        observerSlideLeftElement.observe(el);
    }
    for(let el of teamSlideFromLeftElements){
        observerSlideLeftElement.observe(el);
    }
    for(let el of formSlideFromLeftElements){
        observerSlideLeftElement.observe(el);
    }

    //for adding spotlight effect at the header
    let isMoving = false;
    let lastX = 0;
    let lastY = 0;
    let width = parseFloat(getComputedStyle(spotlightElement).width);
    let height = parseFloat(getComputedStyle(spotlightElement).height);

    function addGlobalEventListener(type, selector, cb, el = document) {
        const element = el.querySelector(selector);
        if (element) {
            element.addEventListener(type, cb);
        }
    }

    function removeGlobalEventListener(type, selector, cb, el = document) {
        const element = el.querySelector(selector);
        if (element) {
            element.removeEventListener(type, cb);
        }
    }

    function headerEnter(e) {
        if (isMoving) return; // Prevent multiple activations while moving inside

        isMoving = true;

        // Add the event listeners for movement and leaving
        addGlobalEventListener("pointermove", "header", headerMove);
        addGlobalEventListener("pointerleave", "header", headerLeave);

        lastX = e.offsetX;
        lastY = e.offsetY;

        spotlightElement.style.cssText = `left:${lastX - (width / 2)}px; top:${lastY - (height / 2)}px;`;
        spotlightElement.classList.add('active');
    }

    function headerMove(e) {
        if (!isMoving) return;
        //if the target is not the navbar instead it's the navlinks
        if(!e.target.classList.contains('navbar')){
            let target = e.target;

            // Get target's bounding box
            let targetRect = target.getBoundingClientRect();
            let targetLeft = targetRect.left;
            let targetTop = targetRect.top;
            let targetWidth = targetRect.width;
            let targetHeight = targetRect.height;

            // Get header's position relative to the page
            let headerRect = headerElement.getBoundingClientRect();
            let headerLeft = headerRect.left;
            let headerTop = headerRect.top;

            // Calculate the actual offsets relative to the header
            let actualOffsetX = targetLeft - headerLeft + e.offsetX;
            let actualOffsetY = targetTop - headerTop + e.offsetY;

            // Move the spotlight underneath the target element, centering it
            let spotlightWidth = parseFloat(getComputedStyle(spotlightElement).width);
            let spotlightHeight = parseFloat(getComputedStyle(spotlightElement).height);

            spotlightElement.style.cssText = `left:${actualOffsetX - (spotlightWidth / 2)}px; top:${actualOffsetY - (spotlightHeight / 2)}px;`;

            return;
        }

        spotlightElement.style.cssText = `left:${e.offsetX - (width / 2)}px; top:${e.offsetY - (height / 2)}px;`;
    }

    function headerLeave() {
        isMoving = false;
        lastX = 0;
        lastY = 0;

        // Remove the event listeners when leaving
        removeGlobalEventListener("pointermove", "header", headerMove);
        removeGlobalEventListener("pointerleave", "header", headerLeave);

        // Optionally, reset the spotlight to a default state when leaving the header
        spotlightElement.style.cssText = `left:-${width}px; top:-${height}px;`; // Example reset position
        spotlightElement.classList.remove('active');

    }

    addGlobalEventListener("pointerenter", "header", headerEnter);

});