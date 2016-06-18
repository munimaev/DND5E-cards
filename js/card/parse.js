let a = 5;

var Card = React.createClass({




  render: function() {
    var typeClassIndex = {"Магия":"cardArcane","Следопыт":"cardRanger","Жрец":"cardCleric","Друид":"cardDruid","Паладин":"cardPaladin","Бард":"cardBard"}; 
    var typeClass = typeClassIndex[this.props.type];
    var bigNameLength = this.props.data.name.length;
    for (var i = 0; i <bigNameLength; i++) {
      if (~['Ж','Ш','Щ','М','ж','ш','щ','м'].indexOf(this.props.data.name[i])) {
        bigNameLength+=0.5;
      }
    } 
    var bigName = bigNameLength > 26 ? true : false;
    var cardClass = 'card ' + typeClass
    return (
      <div className={cardClass}>
        <div className="title"><span className="fs">{this.props.data.name}</span></div>
        <div className="level">{this.props.data.level}, {this.props.data.type}</div>
        <div className="props">
            <div className="prop">
              <div className="propName">Время накладывания</div>
              <div className="propValue">{this.props.data.time}</div>
            </div>
            <div className="prop">
              <div className="propName">Дистанция</div>
              <div className="propValue">{this.props.data.range}</div>
            </div>
            <div className="prop">
              <div className="propName">Компоненты</div>
              <div className="propValue">{this.props.data.components}</div>
            </div>
            <div className="prop">
              <div className="propName">Длительность</div>
              <div className="propValue">{this.props.data.duration}</div>
            </div>
        </div>
        <CardText text={this.props.data.text} hightlevel={this.props.data.hightlevel} bigName={bigName}/>
        <div className="footer">
          {this.props.type} - {this.props.data.level}
        </div>
      </div>
    );
  }
});

var CardText = React.createClass({
  render: function() {
    var fontSizeClass = 'text';
    var len = 0;
    this.props.text.forEach(function(pText, ind) {
      len += pText.length;
    })

    if (this.props.bigName) {
      if (len > 900) {
        if (len > 1000) {
          fontSizeClass += ' small';
        }
        else {
          fontSizeClass += ' preSmall'
        }
      }
    } else {
      // if (len > 1150) {
        if (len > 1250) {
          fontSizeClass += ' small';
        }
        else {
          // fontSizeClass += ' preSmall'
        }
      // }
    }

    // if ((len > 1000 && this.props.bigName) || len > 1250) {
    //     fontSizeClass += ' small';
    // }
    if (this.props.bigName) {
      fontSizeClass += ' bigName';
    }

    var cardText = this.props.text.map(function(pText, ind) {
      var pClass = ind == 0 ? "first" : "";
      return (
        <p className={pClass}>{pText}</p>
      );
    });
    var higherLevels = "";
    if (this.props.hightlevel && this.props.hightlevel.length) {
      higherLevels = (<HigherLevels text={this.props.hightlevel} />);
    }
    return (
      <div className={fontSizeClass}>
        <div className="level"></div>
        {cardText}
        {higherLevels}
      </div>
    );
  }
});


var HigherLevels = React.createClass({
  render: function() {
    var cardText = this.props.text.map(function(pText, ind) {
      var pClass = ind == 0 ? "first" : "";
      return (
        <p className={pClass}>{pText}</p>
      );
    });
    return (
      <div className="higherLevels">
        <div className="level">На более высоком уровне</div>
        {cardText}
      </div>
    );
  }
});









































var Parser = React.createClass({
  render: function() {
    return (
      <div>
        <div className="block40">
          <ParserInput/>
        </div>
        <div className="block20">
          <ParserCard/>
        </div>
        <div className="block40">
          <ParserOutput/>
        </div>
      </div>
    );
  }
});

var ParserInput = React.createClass({
  getInitialState: function() {
    return {value: 'ВОСПЛАМЕНЯЮЩАЯСЯ ТУЧА'};
  },
  handleChange: function(event) {
    parseEvents.eventCall('changeText', event.target.value)
    this.setState({value: event.target.value});
  },
  render: function() {
    return (
      <textarea
        value={this.state.value}
        onChange={this.handleChange}
      ></textarea>
    );
  }
});

var ParserOutput = React.createClass({
  getInitialState: function() {
    return {valueJson: ''};
  },
  parse : function(text) {
    var arr = text.split("\n");
    var result = '{';
    result += '\n"name": "' + (arr[0].substr(0,1)) + ((arr[0].substr(1)).toLowerCase()) + '",';


    result += '\n"level": "'+arr[1].substr(0,arr[1].indexOf(','))+'",'
    result += '\n"type": "'+arr[1].substr(arr[1].indexOf(',')+2)+'",'


    var time = /(?:Время накладывания: )([\s\S]+?)(?:\nДистанция:)/.exec(text);
    result += '\n"time": "'+time[1]+'",'

    var range = /(?:Дистанция: )([\s\S]+?)(?:\nКомпоненты:|Длительность:)/.exec(text);
// console.log('range',range)
    result += '\n"range": "'+range[1]+'",'

    var components = /(?:Компоненты: )([\s\S]+?)(?:\nДлительность:)/.exec(text);
    var longComponents = '';
    components = components[1];

    if (~components.indexOf('(')) {
      var open = components.indexOf('(')+1;
      var close = components.indexOf(')');
      longComponents = '\n  "Материалы: ' + components.substr(open, close-open) + '.",';
      var doPos = components.indexOf('(');
      components = components.substr(0,doPos-1)
    }

    result += '\n"components": "'+components+'",'



    var duration = /(?:Длительность: )([\s\S]+?)(?:\n[АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮЯ])/.exec(text);

    var effect0 = text.substr(duration.index+10);

    var effect = effect0;

    var hight = effect0.indexOf('На больших уровнях:');

    if (~hight) {

      effect = effect0.substr(0,hight-0)
      hight = effect0.substr(hight+20)
    } else {
      var hight = effect0.indexOf('\n*'); 
      if (~hight) {

         effect = effect0.substr(0,hight-1)
         hight = effect0.substr(hight+1)
       } else {
         hight = null;
       }
    }



    var longDuration = '';
    duration = duration[1]
    if (duration.length > 11) {
      longDuration = '\n  "Длительность: ' + duration + '.",';
      var doPos = duration.indexOf('до');
      duration = 'Д' + duration.substr(doPos+1)
    }
    result += '\n"duration": "'+duration+'",'

    result += '\n"text": [' + longComponents + longDuration;
    var effects = effect.match(/(.+(?:\n[^АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮЯ].+)+)/gm)

    effects.forEach(function(o,i,a) {
      result += '\n  "'+o+'"';
      if (i < a.length - 1) {
        result += ',';
      }
    })




    result += '\n],' ;

      result += '\n"hightlevel": [';
    if (hight) {

      var hights = hight.match(/(.+(?:\n[^АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮЯ].+)+)/gm)

      hights.forEach(function(o,i,a) {
        result += '\n  "'+o+'"';
        if (i < a.length - 1) {
          result += ',';
        }
      })
    }

    result += '\n]' ;


    result += '\n}';
    this.setState({valueJson: result});
    parseEvents.eventCall('changeJSON', result)
  },
  componentWillMount : function() {
    parseEvents.eventSign('changeText', this.parse, this)
  },
  render: function() {
    return (
      <pre>{this.state.valueJson}</pre>
    );
  }
});


var ParserCard = React.createClass({
  getInitialState: function() {
    return {valueJson: 

     {
      "name": "Врата",
      "class": "Магия",
      "level": "Заговор",
      "type": "_______",
      "time": "1 действие",
      "range": "60 футов",
      "components": "В, С, М",
      "duration": "Мгновенная",
      "text": [
        "Материалы: 132",
        "2",
        "3"
      ],
      "hightlevel": [
        "1",
        "2"
      ]
    }


    };
  },
  changeText : function(result) {

        var text = result.replace(/\n/g,' ')
        var arr = JSON.parse(text);
    this.setState({valueJson: arr});
  },
  componentWillMount : function() {
    parseEvents.eventSign('changeJSON', this.changeText, this)
  },
  render: function() {
    var card = this.state.valueJson;
    var typeClass = 'Arcane';
    return (
      <Card data={card} type={typeClass}/>
    );
  }
});


ReactDOM.render(
  <Parser />,
  document.getElementById('content')
);