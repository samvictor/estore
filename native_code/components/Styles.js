import {
  StyleSheet,
  PixelRatio,
} from 'react-native';

const styles = StyleSheet.create({
  h3: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
  },
  h5: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
  white_text: {
    color: '#ffffff',
  },
  text: {
    color: '#333333',
    margin: 5,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  item: {
    margin: 2,
    marginHorizontal: 1,
    borderRadius: 2,
    overflow: 'hidden',
  },
  item_shaddow: {
    shadowOpacity: 0.75,
    shadowRadius: 2,
    shadowColor: '#808080',
    shadowOffset: { height: 0, width: 0 },
    elevation: 2,
    width: '90%',
    marginVertical: 10,
    borderRadius: 1,
    overflow: 'hidden',
  },
  item_image: {
    width: '100%',
    height: 230,
  },
  item_content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  item_title: {
    margin: 0,
    marginBottom: 10,
    textAlign: 'left',
    color: 'black',
  },
  item_desc: {
    marginTop: 0,
    marginBottom: 16,
  },

  sam_snack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000060',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;
