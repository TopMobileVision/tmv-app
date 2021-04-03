mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgzQ1dGWjhQNjIifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjE2OTA0NzYzLCJleHAiOjE2MTk1ODMxNjN9.nME9bxXIl3eE1-43BVKu7XmZAyRGfAZGhOOhiIL-mnuyJu2gLq_9vxQQ-Jjly-KUtWAArs0DnHTa9Z4-_F2gYQ');
    }
});
const map = new mapkit.Map("map");


const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const rand_city = () => ['San Diego', 'La Mesa', 'La Jolla', 'El Cajon', 'San Marcos'][Math.floor(Math.random()*5)];

const generate_route = (route: string, sum_bins: number, det_bins: number) => {
    const perc = (det_bins / sum_bins * 100).toFixed(0);
    const type = perc == '100' ? 'class="complete"' : '';
    return `<tr ${type}><td><mygrid>
    <div id="A">#${route}</div>
    <span id="B">${perc}%</span>
    <span id="D">Apr. 3</span>
    <div id="C">${rand_city()}</div>
    </mygrid></td></tr>`; 
};

for (let step = 0; step < 8; step++) {
    const id   = rand(1000, 9999);
    const num1 = rand(0, 500);
    const num2 = rand(num1/2, num1);

    $('.routes-container tbody').append(generate_route(`${id}`, num1, num2));
}


$('.routes-container tbody').append(generate_route('0550', 350, 350));