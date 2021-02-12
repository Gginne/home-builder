//EDITOR VARIABLES
var selected = null
var option = "point"

//AREA DATA
var area = {
    width: 1000,
    height: 500,
    scale: 1,
    rotation: 0,
    bounds: {},
    rooms: []
}

const to_coords = coord_string => {
    const coord = coord_string.split(",")
    const [x,y] = coord
    return {x, y}
}

//VIEW CONTROL
const view = document.querySelector("#view");
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
    let svg_edges = ""
    let svg_vertices = ""

    for(let edge in area.bounds){
        let coords = to_coords(edge)
        let selected_str = selected ? `${selected.x},${selected.y}` : ""
        const {x, y} = coords
        svg_edges += `<circle cx=${x} cy=${y} class="point" r="2" stroke="${edge == selected_str ? "orange": "lightgreen"}" stroke-width="7" />`
        area.bounds[edge].forEach(vertex => {
            let vcoords = to_coords(vertex)
            svg_vertices += `<line x1=${x} y1=${y} x2=${vcoords.x} y2=${vcoords.y} style="stroke:black;stroke-width:2" />`
        })
    }
  

    let shape = `
    <svg width="1000" height="500">
        ${svg_edges}
        ${svg_vertices}
    </svg>
    
    `
    
    view.innerHTML = shape
    
}



//OPTION - FUNCTIONS
const selectOption = opt => {
    option = opt 
}
const createPoint = e => {
     if(!e.target.classList.contains("point")) {
        const {layerX, layerY} = e
        area.bounds[`${layerX},${layerY}`] = []
        //Option == Line
        let curr = {x: layerX, y: layerY}
        if(selected){
            connect(selected, curr)
        }
        selected = curr
    }
}

const deletePoint = e => {
    if(e.target.classList.contains("point")) {  
        const x = e.target.cx.animVal.value
        const y = e.target.cy.animVal.value
        const coords = `${x},${y}`
        delete area.bounds[coords]
        for(let edge in area.bounds){
            area.bounds[edge] = area.bounds[edge].filter(c => c != coords)
        }
        selected = null
   
   }

  
}



