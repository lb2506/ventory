import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      isVisible={visible}
      swipeDirection="down"
      onBackdropPress={onCancel}
      onSwipeComplete={onCancel}
      animationInTiming={200}
      animationOutTiming={500}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={500}
      style={styles.modal}
    >
      <View style={styles.bottomNavigationView}>
        <View style={styles.center}>
          <View style={styles.barIcon} />
        </View>
        <TouchableOpacity style={styles.textContainer} onPress={onConfirm}>
          <Text style={styles.textButton}>Confirmer</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity style={styles.textContainer} onPress={onCancel}>
          <Text style={styles.textButton}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomNavigationView: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
    marginTop: 12,
    marginBottom: 12,
  },
  textButton: {
    textAlign: "center",
    fontSize: 17,
  },
  line: {
    height: 1,
    width: "90%",
    backgroundColor: "#bbb",
  },
  textContainer: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
});

export default ConfirmDeleteModal;
