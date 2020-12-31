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

function Explain(props){
  return (
    <Button id='explainButton' onClick={props.explain} type='submit'>{props.next? "Next" : "Explain Answer"}</Button>
  )
}

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      numberPyramid: [],
      nTiers: 3,
      greatestPathSums: [],
      explanationPyramid: [],
      solved: false,
      explanation: null
    }
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
    var highlighted = [...document.getElementsByClassName('highlight')]
    path.forEach((e) => e.classList.toggle('finalPath'))
    highlighted.forEach((e) => e.classList.toggle('highlight'))

    document.getElementById('explanationText').textContent = ''
    this.setState({
      nTiers: T,
      greatestPathSums: [],
      explanationPyramid: [],
      solved: false,
      explanation: null
    }, this.generatePyramid)
  }

  generatePyramid() {
    var pyramid = []
    for (let t=1; t <= this.state.nTiers; t++){
      let tier = []
      for (let i=0; i <t; i++){
        tier.push(Math.floor(1 + Math.random() * 8))
      }
      pyramid.push(tier)
    }
    this.setState({
      numberPyramid: pyramid,
      explanationPyramid: pyramid
    })
  }

  solvePyramid(){
    if (this.state.numberPyramid.length === 0){
      return 
    }
    this.setState({
      greatestPathSums: this.computeDescentPaths(),
      solved: true
    }, this.stylePath)
  }


  solveTier(tier, parentSums){
    let tierSums = []
    tier.forEach((val, i) => {
      tierSums.push(val + Math.max(parentSums[Math.max(i-1, 0)], parentSums[Math.min(i, parentSums.length - 1)]))
    })
    return tierSums
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
      let tierSums = this.solveTier(tier, parentSums)
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

  explainOnClick() {
    if (!this.state.explanation) {
      this.setState({
        'explanation': this.explainNext()
      }, () => {
        let txt = this.state.explanation.next().value
        let p = document.getElementById('explanationText')
        p.textContent = txt
      })
    }
    else {
      const itr = this.state.explanation
      let txt = itr.next().value
      if (!txt) {
        let ix = this.state.explanationPyramid[this.state.explanationPyramid.length-1].indexOf(
          Math.max(...this.state.explanationPyramid[this.state.explanationPyramid.length-1])
        )
        this.highlight(this.state.nTiers-1, {parent:[], tier:[ix]})
        return
      }
      let p = document.getElementById('explanationText')
      p.textContent = txt

    }
  }

  *explainNext() { 
    var texts = [
      "Finding the maximum sum from the tip of the pyramid to the second tier is trivial since there is only 1 possible path for each node.",
      "Record the answers in an answer table for each node in the 2nd tier.",
      "Then determine the answers for each node in the third tier by selecting the greatest value from each nodes direct parent, then add the nodes value.",
      "For nodes lying on the outside edges of the pyramid the maximum sum will be the maximum sum for the parent plus the value of the node",
      "Continue this process for every node in the pyramid. The final answer is the largest value in the last row of the answer table."
    ]

    var highlights = [
      {'parent': [0], 'tier': [0, 1]},
      {'parent': [0], 'tier': [0, 1]},
      {'parent': [0, 1], 'tier': [1]},
      {'parent': [0], 'tier': [0]},
    ]
    
    this.highlight(1, highlights[0])
    yield texts[0]
    var updated = this.state.explanationPyramid.slice(0)
    var change = [
      this.state.numberPyramid[0],
      [ 
        this.state.numberPyramid[0][0] + this.state.numberPyramid[1][0],
        this.state.numberPyramid[0][0] + this.state.numberPyramid[1][1]
      ]
    ]
    updated.splice(0,2, ...change)
    this.highlight(1, highlights[1])
    this.setState({
      explanationPyramid: updated
    })
    yield texts[1]
    for (let t=2; t<Math.min(this.state.nTiers,5); t++) {
      this.highlight(t, highlights[t])
      let tier = this.state.numberPyramid[t]
      let parentSums = updated[t - 1]
      let change = this.solveTier(tier, parentSums)
      updated.splice(t,1, change)
      this.setState({
        explanationPyramid: updated
      })
      yield t < texts.length ? texts[t] : null
    }
  }

  highlight(t, spec) {
    // reset
    var highlighted = [...document.getElementsByClassName('highlight')]
    highlighted.forEach((e) => e.classList.toggle('highlight'))

    if (!spec){
      return
    }

    let tier = document.querySelectorAll('#explanationPyramid > .tier')[t]
    let parent = document.querySelectorAll('#explanationPyramid > .tier')[Math.max(t-1, 0)]
    console.log(parent)
    console.log(tier)
    spec['parent'].forEach((ix) => {
      parent.querySelectorAll('.pyramidValue')[ix].classList.toggle('highlight')
    })
    spec['tier'].forEach((ix) => {
      tier.querySelectorAll('.pyramidValue')[ix].classList.toggle('highlight')
    })
    

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
        <div style={{textAlign: "center"}}><p id="explanationText"></p></div>
        <div id="pyramids">
          <div id='numberPyramid'>
            <NumberPyramid pyramid={this.state.numberPyramid}></NumberPyramid>
          </div>
          { this.state.explanation ?
            <div id="explanationPyramid">
              <NumberPyramid pyramid={this.state.explanationPyramid}></NumberPyramid>
            </div>
            : null
          }
        </div>
        <div style={{display: result ? 'inline': 'none'}} id='answer'>The greatest path total is {result}</div>
        <br/>
        <hr/>
        {
          this.state.solved ? 
          <Explain next={this.state.explanation} explain={this.explainOnClick.bind(this)}></Explain> : null
        }
      </div>
    )
  }
}

export default App;
