import { ListItem } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

const List = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <ListItem.Accordion
      style={styles.listItem}
      content={
        <>
          <ListItem.Content>
            <ListItem.Title>{props.value}</ListItem.Title>
          </ListItem.Content>
        </>
      }
      isExpanded={open}
      onPress={() => {
        setOpen(!open);
      }}
    >
      {props.items.map((l, i) => (
        <ListItem
          key={i}
          onPress={() => {
            props.setValue(l.label), setOpen(!open);
          }}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>{l.label}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </ListItem.Accordion>
  );
};

const styles = StyleSheet.create({
  listItem: {
    borderWidth: 1,
  },
});

export default List;
