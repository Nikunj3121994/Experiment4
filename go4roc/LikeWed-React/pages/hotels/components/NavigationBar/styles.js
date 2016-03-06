const NAV_BAR_HEIGHT = 39;
const STATUS_BAR_HEIGHT = 20;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

module.exports = {
  navBarContainer: {
    backgroundColor: 'white',
    opacity: 0.9,
    borderBottomWidth: 0.5,
    borderColor: "#D2D2D2"
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: "#D2D2D2",
  },
  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBarButton: {
    marginTop: 7.5,
    marginBottom: 7.5,
    alignItems: 'center',
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
    marginTop: 10.5,
    marginBottom: 10.5,
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: '#333',
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    textAlign: 'center',
    backgroundColor: "#green"

  },
};
