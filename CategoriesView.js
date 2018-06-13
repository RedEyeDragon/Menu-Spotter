'use strict';

var React = require('react-native');
var SubcategoriesView = require('./SubcategoriesView')
var {
  StyleSheet,
  Image, 
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component
} = React;

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

function urlForCategories(locationID) {
  var querystring = locationID;

  return 'https://order.postmates.com/v1/categories/' + querystring + '/products';
}

class CategoriesView extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {
        rowHasChanged: (r1, r2) => {
          r1.name !== r2.name
        }
      });
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.category),
      message: ''
    };
  }

  _handleCategoriesResponse(response) {
    console.log('Response', response.categories)
    if(response.length) {
      this.props.navigator.push({
        title: "Sub Categories",
        component: SubcategoriesView,
        passProps: {subcategory: response}
      });
    } else {
      this.setState({ message: 'Categories not found'});
    }
  }

  _executeCategoriesQuery(query) {
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleCategoriesResponse(json.catalog))
      .catch(error => {
        this.setState({
          message: error
        })
      })
  }

  rowPressed(restaurantUID) {
    // var property = this.props.listings
    //   .filter(prop => prop.guid === propertyGuid)[0];
    let uid = restaurantUID;
    let query = urlForCategories(uid);
    console.log('Query', query)
    this._executeCategoriesQuery(query);
  }

  renderRow(rowData, sectionID, rowID) {
    console.log('Row Data:::::::::', rowData)
    var name = rowData.name;

    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData.uuid)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View  style={styles.textContainer}>
              <Text style={styles.price}>{name}</Text>
              <Text style={styles.title} 
                    numberOfLines={1}>{rowData.description}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
}


module.exports = CategoriesView;