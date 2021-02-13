//EDITOR VARIABLES
var selected = null
var option = "point"



//AREA DATA
var area = {
    width: 1000,
    height: 300,
    scale: 1,
    rotation: 0,
    bounds: {},
    rooms: []
}



//VIEW SETUP
const view = document.querySelector("#view");
var ctx = view.getContext("2d");
const {width, height} = area
ctx.canvas.width = width
ctx.canvas.height = height
ctx.fillStyle = "white";
ctx.fillRect(0, 0, width, height);

view.addEventListener("click", e => {

    if(option == "point"){
        createPoint(e)
    } else if(option == "delete"){
        deletePoint(e)
    }
    updateUI() 
    pointEventsHandler()
    
})

//DATA CONTROL

const connect = (from, to) => {
    const from_str = `${from.x},${from.y}`
    const to_str = `${to.x},${to.y}`
   
    if(area.bounds[to_str].includes(from_str)){
        //If already connected to curr delete connection
        area.bounds[from_str] = area.bounds[from_str].filter(coord => coord != to_str)
        area.bounds[to_str] = area.bounds[to_str].filter(coord => coord != from_str)
    }else{
        if(area.bounds[to_str].length == 2 || area.bounds[from_str].length == 2){
            return //If already connected to two return
        } else { //Else connect selected and curr
            for(let edge in area.bounds){
                const coord = to_coords(edge)
                if(coord.x == to.x && coord.y == to.y){
                    area.bounds[edge].push(from_str)
                
                }else if(coord.x == from.x && coord.y == from.y){
                    area.bounds[edge].push(to_str)
            
                }
            }
        }
    }

    //selected = null //Option == Point 
    console.log(`connected (${to.x}, ${to.y}) with (${from.x}, ${from.y}) `)
}

const pointEventsHandler = () => {
    if(option != "delete" ){
        let points = document.querySelectorAll(".point");
        points.forEach(point => {
            point.addEventListener("click", e => selectPoint(e))    
        })
        const selectPoint = e => {
            const x = e.target.cx.animVal.value
            const y = e.target.cy.animVal.value
            const curr = {x, y}
            if(selected){
                if(selected.x == x && selected.y == y){
                    selected = null
                } else {
                    connect(selected, curr)
                    selected = curr
                }
            } else{
                selected = curr
            }
        }
    }
}



//UI CONTROL
const updateUI = () => {
    
    for(let edge in area.bounds){
        let coords = to_coords(edge)
        const {x, y} = coords
        
        ctx.fillStyle = "lightgreen";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill()
    }
      
    
    
}

//HELPERS
const to_coords = coord_string => {
    const coord = coord_string.split(",")
    const [x,y] = coord
    return {x, y}
}

const get_coords = e => {
    let rect = view.getBoundingClientRect()
    let x = (e.clientX - rect.left)*view.width / rect.width;
    let y = (e.clientY - rect.top) *view.height / rect.height;
    return {x, y}
}


//OPTION - FUNCTIONS

const selectOption = opt => {
    option = opt 
}

const createPoint = e => {
    const {x, y} = get_coords(e)
    const coords = `${x},${y}`
    if(!area.bounds.hasOwnProperty(coords)) {
        
        area.bounds[coords] = []
        //Option == Line
        let curr = {x, y}
        if(selected){
            connect(selected, curr)
        }
        selected = curr
    }
}

const deletePoint = e => {
    const {x, y} = get_coords(e)
    const coords = `${x},${y}`
    console.log(x,y)
    if(area.bounds.hasOwnProperty(coords)) {  
       
        delete area.bounds[coords]
        for(let edge in area.bounds){
            area.bounds[edge] = area.bounds[edge].filter(c => c != coords)
        }
        selected = null
   }

  
}



