import {
  View,
  Image,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  NetInfo,
  StatusBar
} from "react-native";
import React, { Component } from "react";
import { StackNavigator, NavigationActions } from "react-navigation";
import EStyleSheet from "react-native-extended-stylesheet";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Form,
  Label,
  Input,
  Item,
  Row
} from "native-base";
import Swiper from "react-native-swiper";

import Controllers from "../controller/controller.js";
import myAlert from "../components/myAlert.js";

export default class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      showAlert: false,
      _title: "",
      msg: ""
    };
  }

  // navigation Options
  static navigationOptions = {
    header: null,
    tabBarVisible: true
  };

  // Check internet connectivity
  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "change",
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(isConnected => {
      this.setState({ isConnected });
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "change",
      this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  // show customized alert
  showAlert = (__title, __msg) => {
    this.setState({
      ...this.state,
      showAlert: true,
      _title: __title,
      msg: __msg
    });
  };

  // What happens after you press login button
  onLoginPressed() {
    // Validation
    if (this.state.isConnected) {
      if (
        validateEmail(this.state.email) &&
        validateFilled(this.state.password)
      ) {
        this.loginUser();
      }
    } else {
      this.showAlert("ERROR", "Connect to internet please!");
    }
  }

  // connect to server and etc.
  loginUser() {
    let url = "http://69778130.ngrok.io/";

    fetch(url + "login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.showAlert("", responseJson.message);
        if (responseJson.error == false) {
          this.props.navigation.dispatch(resetAction);
        }
      });
  }

  // render my customized alert
  renderMyAlert = (showAlert, _title, msg) =>
    myAlert({
      showAlert,
      _title,
      msg,
      onDismiss: () =>
        this.setState({
          ...this.state,
          showAlert: false
        })
    });

  // main render func
  render() {
    const { showAlert, _title, msg } = this.state;

    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor="#2C3E50" />
        <View style={styles.loginPageTop}>
          <Image
            source={require("../img/logo_top.png")}
            style={styles.loginPageLogo}
          />
        </View>

        <Content>
          <Form>
            <Item
              floatingLabel
              success={validateEmail(this.state.email) ? true : false}
            >
              <Label>Email</Label>
              <Input
                onChangeText={text => this.setState({ email: text })}
                keyboardType="email-address"
              />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry={true} />
            </Item>
          </Form>

          <View>
            <Text>{"\n\n\n\n\n\n\n"}</Text>
          </View>
          <Button
            block
            style={styles.button}
            onPress={this.onLoginPressed.bind(this)}
            onLongPress={() => this.props.navigation.dispatch(resetAction)}
          >
            <Text>Login</Text>
          </Button>
        </Content>

        {this.renderMyAlert(showAlert, _title, msg)}
      </Container>
    );
  }
}

// reset stack for navigator
const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "_third" })],
  key: null
});

// my lovely styles :D
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F0FFFF"
  },

  loginPageTop: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center"
  },

  loginPageLogo: {
    width: 150,
    height: 60,
    margin: 15,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center"
  },

  input: {
    alignSelf: "stretch",
    height: 50,
    margin: 10,
    marginHorizontal: 15,
    padding: 3,
    textAlign: "center",
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#00BFFF"
  },

  button: {
    backgroundColor: "#708090",
    marginHorizontal: 15,
    alignSelf: "stretch",
    justifyContent: "center"
  }
});
