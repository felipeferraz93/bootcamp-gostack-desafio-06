import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { ActivityIndicator , Text } from 'react-native';
import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author, } from './styles';

export default class User extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: false,
    page:1,
    refreshing:false,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const { page } = this.state;

    console.tron.log(page);

    this.setState({ loading: true });

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({ stars: response.data, loading:false });


  }

  loadMore = async ()=>{
    const { navigation } = this.props;

    const { stars, page } = this.state;

    const newPage = page + 1;

    console.tron.log(newPage);

    //this.setState({ loading: true });

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${newPage}`);

    this.setState({stars:[...stars, ...response.data]/*, loading:false */});
  }

  refreshList = async ()=>{
    this.setState({ stars: [], refreshing:true, page:'1' });

    const { navigation } = this.props;
    const { page } = this.state;

    this.setState({ loading: true });

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({ stars: response.data, loading:false, refreshing:false});


  }

  handleNavigate = repository => {

    console.tron.log('entrou');
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };


  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user = navigation.getParam('user');


    return (

      <Container>
        <Header>

          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>

        </Header>


          { loading ?
          (<ActivityIndicator color="#4f4f4f" />)
           :
           (<Stars
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={this.state.refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={this.loadMore} // Função que carrega mais itens
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred >
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title onPress={() => this.handleNavigate(item)}>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />) }





      </Container>

    )
  }

}
