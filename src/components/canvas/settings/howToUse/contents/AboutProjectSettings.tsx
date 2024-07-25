function AboutProjectSettings() {
  return (
    <section className="text-md flex flex-col gap-2">
      <p>
        Click on the second icon on the side menu to open{' '}
        <b>Project Settings</b>.
      </p>
      <img
        alt="project settings"
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
        <b>Select HDL language:</b> Will toggle between different HDL languages
        on the resulting code. (coming soon...)
      </p>
      <p>
        <b>Export Save File:</b> Save your project in a file on your computer.
      </p>
      <p>
        <b>Import Save File:</b> Import a save file from your computer to load a
        project.
      </p>
      <p>
        <b>Reset Entire Project</b> Will clear all the changes you made to your
        project and start over.
      </p>
    </section>
  );
}

export default AboutProjectSettings;
