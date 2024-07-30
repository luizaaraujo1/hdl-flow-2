function AboutPortSettings() {
  return (
    <section className="text-md flex flex-col gap-2">
      <p>
        Click on the third icon on the side menu to open <b>Port Settings</b>.
      </p>
      <img
        alt="side menu port editor"
        width="150px"
        src="/images/side_menu_port_editor.png"
      />
      <img alt="default state" width="600px" src="/images/port_editor.png" />
      <p>Here you can:</p>
      <p>
        <b>Select Port Type:</b> Use the tabs to select between what type of
        Port you want to create/edit.
      </p>
      <p>
        <b>Add a Port:</b> Click on the bottom right button to add a Port of the
        selected Port Type to your project. Conceptually the FSM Port allows for
        communication between the FSM and other components in the system. This
        could include inputs that trigger state changes, outputs that reflect
        the current state, or control signals for managing the operation of the
        FSM.
      </p>
      <p>
        <b>Edit a port:</b> Click on the gear icon to expand the editing options
        for the corresponding port. You will be able to change many of the
        characteristics of the Port, like its name and type.
      </p>
      <img
        alt="default state"
        width="400px"
        src="/images/port_editor_element.png"
      />
      <p>
        <b>Delete a port:</b> Use the red button to delete a Port that you have
        added to the project.
      </p>
    </section>
  );
}

export default AboutPortSettings;
