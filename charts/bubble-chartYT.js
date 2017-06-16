let data = {
    "children": [{
        "src": 'https://www.youtube.com/embed/F-eMt3SrfFU?autoplay=1&enablejsapi=1',
        "views": 21097531,
        "playerID": "player1"
    }, {
        "src": "https://www.youtube.com/embed/XI4Na5JW1ns?autoplay=1&enablejsapi=1",
        "views": 177639,
        "playerID": "player2"
    }, {
        "src": "https://www.youtube.com/embed/nsrOCzUwcjE?autoplay=1&enablejsapi=1",
        "views": 1073553,
        "playerID": "player3"
    }, {
            "src": "https://www.youtube.com/embed/AjCebKn4iic?autoplay=1&enablejsapi=1",
            "views": 1507944,
            "playerID": "player4"
    }, {
        "src": "https://www.youtube.com/embed/DiTECkLZ8HM?autoplay=1&enablejsapi=1",
        "views": 26112988,
        "playerID": "player5"
    }]
}

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let playerName;
let playerArr = [];
function onYouTubeIframeAPIReady() {
    for (var i = 0; i < data.children.length; i++) {
        playerName = createPlayer(data.children[i].playerID);
        playerArr.push(playerName)
    }
}

function createPlayer(playerInfo) {
    return new YT.Player(playerInfo, {
        events: {
            'onReady': onPlayerReady
        }
    })
}

function onPlayerReady(event) {
   event.target.playVideo().mute();
}

const diameter = 600;

const bubble = d3.pack(data)
    .size([diameter, diameter])
    .padding(1.5);

const svg = d3.select("#vis")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

//calculates radius, x and y positions for all child nodes
const root = d3.hierarchy(data)
    .sum(function (d) { return d.views; });

const node = svg.selectAll(".node")
    .data(bubble(root).descendants())
    .enter()
    //only keeps objects that don't have children property
    .filter((d) => !d.children)

//support for firefox
if (typeof InstallTrigger !== 'undefined') {
  const g = node.append('g')
      .attr("class", "node")
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")

  const foreignObject = g.append('foreignObject')
      .attr('width', (d) => d.r * 2)
      .attr('height', (d) => d.r * 2)
      .attr('x', (d) => -d.r)
      .attr('y', (d) => -d.r)
      .style('pointer-events', 'none');

  const video = foreignObject.append('xhtml:iframe')
      .attr('src', (d) => d.data.src)
      .attr('width', (d) => d.r * 2)
      .attr('height', (d) => d.r * 2)
      .attr('id', (d) => d.data.playerID)
      .attr('frameborder', 0)
      // .style('position', 'fixed')
      .style('border-radius', '50%')
      .style('object-fit', 'cover')
      .style('width', '100%')
      .style('height', '100%');
}

//support for chrome
else {
  const g = node.append('g')

  const foreignObject = g.append('foreignObject')
      .attr('x', (d) => d.x - d.r)
      .attr('y', (d) => d.y - d.r)
      .style('pointer-events', 'none');

  const div = foreignObject
      .append('xhtml:div')
      .style('width', (d) => (d.r * 2) + 'px')
      .style('height', (d) => (d.r * 2) + 'px')
      .style('border-radius', (d) => d.r + 'px')
      .style('-webkit-mask-image', '-webkit-radial-gradient(circle, white 100%, black 100%)')
      .style('position', 'relative')

  const video = div
      .append('xhtml:iframe')
      .attr("xmlns", "http://www.w3.org/1999/xhtml")
      .attr('src', (d) => d.data.src)
      .attr('id', (d) => d.data.playerID)
      .attr('frameborder', 0)
      .style('width', (d) => (d.r * 2) + 'px')
      .style('height', (d) => (d.r * 2) + 'px')
      .style('position', 'absolute');
}

// position circle below video bubble to handle mouse events
const circle = g.append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .on('mouseenter', handleMouseEnter)
    .on('mouseleave', handleMouseLeave);

function handleMouseEnter(d, i) {
   playerArr[i].unMute()
}

function handleMouseLeave(d, i) {
   playerArr[i].mute()
}