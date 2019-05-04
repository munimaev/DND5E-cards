var Card = React.createClass({
  render: function() {
    var typeClassIndex = {
      "Магия":"cardArcane",
      "Следопыт":"cardRanger",
      "Жрец":"cardCleric",
      "Жрец Бури":"cardCleric",
      "Жрец Войны":"cardCleric",
      "Жрец Жизни":"cardCleric",
      "Жрец Знания":"cardCleric",
      "Жрец Обмана":"cardCleric",
      "Жрец Природы":"cardCleric",
      "Жрец Света":"cardCleric",
      "Друид":"cardDruid",
      "Паладин":"cardPaladin",
      "Бард":"cardBard"
    }; 
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
console.log(Card)

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