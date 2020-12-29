import React from "react"
import './App.css';
import NumberPyramid from "./components/number-pyramid"
import { Button, Input } from 'semantic-ui-react'

function Reset(props){
  return (
    <div id="resetDiv" className="header">
      <p>Choose the number of tiers in the number pyramid</p>
      <Input type='number' id="nTiers" name="nTiers" placeholder={'3-10'} action><input/>
        <Button id='resetPyramidButton' onClick={props.resetPyramid} type='submit'>Reset</Button>
      </Input>
    </div>
  )
}

function Solve(props){
  return (
    <div className="header" id="solve">
      <Button size="large" id='solveButton' onClick={props.solvePyramid} type='submit'>Solve</Button>
    </div>
  )
}



function ShowState(props){
  return (
    <div id="showState">
      <Button id='showStateButton' onClick={props.showState} type='submit'>Show State</Button>
    </div>
  )
}

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      numberPyramid: [],
      nTiers: 3,
      greatestPathSums: []
    }
  }

  shouldComponentUpdate() {
    return !this.state._locked
  }

  showState(){
    console.log(this.state)
  }

  resetPyramid(){
    const T = Number(document.getElementById('nTiers').value)
    if (T < 3 || T > 10) {
      alert('Choose a number between 3 and 10')
      return;
    }
    var path = [...document.getElementsByClassName('finalPath')]
    path.forEach((e) => e.classList.toggle('finalPath'))
    this.setState({
      nTiers: T,
      greatestPathSums: []
    }, this.generatePyramid)
  }

  solvePyramid(){
    if (this.state.numberPyramid.length === 0){
      return 
    }
    this.setState({
      greatestPathSums: this.computeDescentPaths()
    }, this.stylePath)
  }

  generatePyramid() {
    var pyramid = []
    for (let t=1; t <= this.state.nTiers; t++){
      let tier = []
      for (let i=0; i <t; i++){
        tier.push(Math.floor(Math.random() * 9))
      }
      pyramid.push(tier)
    }
    this.setState({
      numberPyramid: pyramid 
    })
  }


  computeDescentPaths() {
    var pathSums = [
      this.state.numberPyramid[0],
      [ 
        this.state.numberPyramid[0][0] + this.state.numberPyramid[1][0],
        this.state.numberPyramid[0][0] + this.state.numberPyramid[1][1]
      ]
    ]

    // calculate max path by adding to the greatest max path of either parent
    for (let t=2; t < this.state.nTiers; t++) {
      let tier = this.state.numberPyramid[t]
      let parentSums = pathSums[t - 1]
      let tierSums = []
      tier.forEach((val, i) => {
        tierSums.push(val + Math.max(parentSums[Math.max(i-1, 0)], parentSums[Math.min(i, parentSums.length - 1)]))
      })
      pathSums.push(tierSums)
    }
    return pathSums
  }

  stylePath() {
    let answer = Math.max(...this.state.greatestPathSums[this.state.nTiers-1])
    var ix = this.state.greatestPathSums[this.state.nTiers - 1].indexOf(answer)
    document.getElementById('numberPyramid')
            .getElementsByClassName('tier')[this.state.nTiers - 1]
            .getElementsByClassName('pyramidValue')[ix]
            .classList.toggle('finalPath')
    // iterate backwards to determine path
    for (let r=this.state.nTiers-2; r >= 0; r--) {
      console.log(r)
      let row = this.state.greatestPathSums[r]
      ix = ix === 0 ? 0: row[ix] > row[ix - 1] ? ix : ix -1
      // debugger;
      document.getElementById('numberPyramid')
              .getElementsByClassName('tier')[r]
              .getElementsByClassName('pyramidValue')[ix]
              .classList.toggle('finalPath')
    }
  }

  render() {
    var result = this.state.greatestPathSums.length > 0 ? Math.max(...this.state.greatestPathSums[this.state.nTiers - 1]) : 0
    return (
      <div id='app'>
        <header>
          <div id='buttons'>
            <Reset resetPyramid={this.resetPyramid.bind(this)}/>
            <Solve solvePyramid={this.solvePyramid.bind(this)}/>
          </div>
        </header>
        <div id='numberPyramid'>
          <NumberPyramid pyramid={this.state.numberPyramid}></NumberPyramid>
        </div>
        <div style={{display: result ? 'initial': 'none'}} id='answer'>The greatest path total is {result}</div>
        <br/>
        <hr/>
        {/* <div id='solution'>
          <NumberPyramid pyramid={this.state.greatestPathSums}></NumberPyramid>
        </div> */}
      </div>
    )
  }
}

export default App;
