var SelectModel = React.createClass({
  loadOptionsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        var models = data.models.sort( function(a,b) {
          if (a.visibleModelName > b.visibleModelName) {
            return 1;
          }
          if (a.visibleModelName < b.visibleModelName) {
            return -1;
          }
          return 0;
        } );
        var options = models.map(function(o){
            return {
              value : o.modelName, label: o.visibleModelName
            }
        })
        this.setState({options: options});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {options: [], value : null};
  },
  componentDidMount: function() {
    this.loadOptionsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  onSelectFunc : function(val) {
    var newVal = null;
    if (val !== null) {
      newVal = val.map(function(o){
        return o.value
      });
      newVal+= '';
    }
    this.setState({value: newVal});
  },
  render: function() {

    
    return (
      <Select
          multi={true}
          name="form-field-name"
          value={this.state.value}
          options={this.state.options}
          onChange={this.onSelectFunc} />
    );
  }
});


var SelectBlock = React.createClass({
  handleSelectedModels : function() {

  },
  render: function() {    
    return (
      <SelectModel url="api/wh.json" getSelectedModels={this.handleSelectedModels}/>
    );
  }
});


ReactDOM.render(
  <SelectBlock/>,
  document.getElementById('content')
);