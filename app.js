const currentTime = new Date;

// function to get current time 
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

assignBg(getTime(currentTime.getHours()))

setInterval(() => {
    document.querySelector('.loading-screen').classList.add('animate-white')
    document.querySelector('.loading-screen').style.backgroundImage = 'none';
    document.querySelector('.container').classList.add('fade-in-container')
}, 2000);