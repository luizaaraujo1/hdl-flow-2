import RoundedScrollContainer from '@components/shared/RoundedScrollContainer';
import SimpleAccordions, {
  AccordionItem,
} from '@components/shared/SimpleAccordions';

function HowToUse() {
  const elements: AccordionItem[] = [
    {
      title: 'What is HDL Flow?',
      content: (
        <section className="text-md flex flex-col gap-2">
          <p>
            HDL Flow is an online tool designed to generate HDL Finite State
            Machine (FSM) code.
          </p>
          <p>
            It&lsquo;s a free and open-source tool that provides an interactive
            and intuitive interface for users.
          </p>
        </section>
      ),
    },
    {
      title: 'Getting started',
      content: (
        <section className="text-md flex flex-col gap-2">
          <p>
            In a new empty project, you will see the <b>Canvas</b> page
            containing a Start Node and State 0.
          </p>
          <img
            alt="default state"
            width="300px"
            src="/images/default_canvas_state.png"
          />
          <p>
            You can also check the <b>Side Menu</b> that contains all the
            important features that you can use to set up your project.
          </p>
          <img alt="side menu" width="150px" src="/images/side_menu.png" />
          <p>
            The first thing you should do in a brand new project is using the
            <b> Port Editor</b> to add all the <b>Ports</b> (third button on the
            menu, top to bottom) that are relevant to the FSM you want to
            create. You can add <b>Input, Output and Internal</b> type Ports and
            they will be automatically added to all the States that you create.
          </p>
          <p>
            With all your Ports set up, you can drag all of the desired
            <b> States </b>
            into the <b>Canvas</b> (click and drag the fourth icon of the side
            menu, top to bottom, and release it on the Canvas to create a new
            State). All states that you add should be uniquely numbered,
            fortunately the default number will increment automatically. You can
            change it on the <b>State Editor</b> later!
          </p>
          <p>
            Now you can connect your FSM States with <b>Transitions</b>, click
            and drag box in the bottom of them, and then connect the resulting
            line to other states, or to itself, to add a Transition.
          </p>
          <p>
            The next step is setting up all the <b>State Logic</b> inside all
            the states you created, you can click any <b>State</b> in the Canvas
            to make the <b>Edit</b> button appear, use it to open the{' '}
            <b>State Editor</b> to set up the value the Ports will assume when
            the FSM reaches that state
          </p>
          <p>
            Once that is done, you can do the same for the <b>Transitions</b>{' '}
            (there is a <b>Transition Editor </b> as well, that can be opened
            similarly). in this case the <b>Transition Logic</b> will determine
            what is the condition for a State to change to another on the rising
            edge of the clock
          </p>
          <p>
            Then you might want to go to <b>Project Settings</b>, set the
            project name and your author name. You can also export the project
            as a file so that you can restore it later! Theres is a button here
            that you can use to clear the project and start over
          </p>
          <p>
            Finally it is time to check your results! Check the{' '}
            <b>Code Results</b> menu to see the generated HDL code. There is a
            button here you can use to easily copy all the code, and this
            component will automatically update if you make any changes to the
            Canvas.
          </p>
        </section>
      ),
    },
    {
      title: 'About: Project settings',
      content: (
        <section className="text-md flex flex-col gap-2">
          <p>
            Click on the second icon on the side menu to open Project Settings.
          </p>
          <img
            alt="default state"
            width="600px"
            src="/images/project_settings.png"
          />
          <p>Here you can:</p>
          <p>
            <b>Edit Project Name:</b> Will appear as a comment in the top of the
            resulting code.
          </p>
          <p>
            <b>Edit Author Name:</b> Will appear as a comment in the top of the
            resulting code.
          </p>
          <p>
            <b>Select HDL language:</b> Will toggle between different HDL
            languages on the resulting code. (coming soon...)
          </p>
          <p>
            <b>Export Save File:</b> Save your project in a file on your
            computer.
          </p>
          <p>
            <b>Import Save File:</b> Import a save file from your computer to
            load a project.
          </p>
          <p>
            <b>Reset Entire Project</b> Will clear all the changes you made to
            your project and start over.
          </p>
        </section>
      ),
    },
    {
      title: 'About: Port editor',
      content: (
        <section className="text-md flex flex-col gap-2">
          <p>Click on the third icon on the side menu to open Port Editor.</p>
          <img
            alt="default state"
            width="600px"
            src="/images/port_editor.png"
          />
          <p>Here you can:</p>
          <p>
            <b>Select Port Type:</b> Use the tabs to select between what type of
            Port you want to create/edit.
          </p>
          <p>
            <b>Add a Port</b> Click on the bottom right button to add a Port of
            the selected Port Type to your project.
          </p>
          <p>
            <b>Edit a port:</b> Click on the gear icon to expand the editing
            options for the corresponding port. You will be able to change many
            of the characteristics of the Port, like its name and type.
          </p>
          <img
            alt="default state"
            width="400px"
            src="/images/port_editor_element.png"
          />
          <p>
            <b>Delete a port:</b> Use the red button to delete a Port that you
            have added to the project.
          </p>
        </section>
      ),
    },
  ];

  return (
    <RoundedScrollContainer>
      <SimpleAccordions elements={elements} />
    </RoundedScrollContainer>
  );
}

export default HowToUse;
