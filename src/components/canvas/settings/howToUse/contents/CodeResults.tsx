function CodeResults() {
  return (
    <section className="text-md flex flex-col gap-2">
      <p>
        Click on the last icon on the side menu to open <b>Code Results</b>.
      </p>
      <img
        alt="side menu code results"
        width="150px"
        src="/images/side_menu_code_results.png"
      />
      <img alt="code results" width="600px" src="/images/code_results.png" />
      <p>Here you can:</p>
      <p>
        <b>See the resulting code:</b> HDL FLow will automatically transpile all
        of your project&apos;s FSM declarations and logic into HDL code. As you
        are making the changes to your project, this section will always be
        transcribing the code in real time on the background, so that you can
        open it and <b>check the results anytime you want</b>.
      </p>
      <p>
        There are some cases where something is wrong or missing on the project,
        so this section will add comments to the code to <b>help you find</b>{' '}
        and fix them.
      </p>
      <p>
        <b>Copy the code:</b> Click on the button in the top right corner of the
        resulting code to <b>copy it to your clipboard</b>. You can paste it
        anywhere you want.
      </p>
    </section>
  );
}

export default CodeResults;
