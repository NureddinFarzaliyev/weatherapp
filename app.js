const currentTime = new Date;

// function to return current time of the day
const getTime = (hour) => {
    if(hour < 5 || hour >= 21){
        return 'Night'
    }else if(hour >= 5 && hour < 12 ){
        return 'Morning'
    }else if(hour >= 12 && hour <= 17){
        return 'Day'
    }else if(hour > 17 && hour < 21){
        return 'Evening'
    }
}

// function to assign text and background according to time
const assignBg = (time) => {
    const text = document.querySelector('.loading-text')
    text.textContent = `Good ${time}!`;

    document.querySelector('body').style.backgroundImage = `url(/src/${time}.jpg)`;
    document.querySelector('.loading-screen').style.backgroundImage = `url(/src/${time}.jpg)`;
}

// assigning text and bg according to time
assignBg(getTime(currentTime.getHours()))

// loading screen fade out after 2 secs
setInterval(() => {
    document.querySelector('.loading-screen').classList.add('animate-white')
    document.querySelector('.loading-screen').style.backgroundImage = 'none';
    document.querySelector('.container').classList.add('fade-in-container')
}, 2000);


// Opening-closing search component

const toggleSearchDesktop = (button, element) => {
    button.addEventListener('click', () => {
        if (element.classList.contains('show-desktop-search')) {
            element.classList.remove('show-desktop-search');
            element.classList.add('hide-desktop-search')
        }else{
            element.classList.remove('hide-desktop-search')
            element.classList.add('show-desktop-search')
        }

    })
}

toggleSearchDesktop(document.querySelector('.loc-desktop'), document.querySelector('.desktop-search'));
toggleSearchDesktop(document.querySelector('.loc-mobile'), document.querySelector('.desktop-search'))