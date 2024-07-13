import SimpleCard from '@shared/SimpleCard';
import SimpleSection from '@shared/SimpleSection';

function Features() {
  return (
    <SimpleSection>
      <div className="container mx-auto">
        <h2 className="section-title">Key Features</h2>
        <div className="section-grid">
          <SimpleCard
            title="Intuitive Interface"
            subtitle=" Easily navigate through HDL Flow's user-friendly interface,
              designed to streamline your workflow."
          />
          <SimpleCard
            title="Code Generation"
            subtitle="  Automatically generate HDL code from FSM diagrams, reducing manual
              effort and potential errors."
          />
          <SimpleCard
            title="(Planned) Collaboration Tools"
            subtitle="Work seamlessly with your team using HDL Flow's collaboration
              features, allowing real-time editing and feedback."
            className="bg-slate-300"
          />
        </div>
        <div className="mt-8 text-center">
          {/* TODO: Add example diagram here */}
        </div>
      </div>
    </SimpleSection>
  );
}

export default Features;
