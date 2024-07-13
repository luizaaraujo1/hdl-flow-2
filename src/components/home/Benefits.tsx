import SimpleCard from '@shared/SimpleCard';
import SimpleSection from '@shared/SimpleSection';

function Benefits() {
  return (
    <SimpleSection>
      <div className="container mx-auto">
        <h2 className="section-title">Benefits of HDL Flow</h2>
        <div className="section-grid">
          <SimpleCard
            title="Efficient Workflow"
            subtitle="Streamline your design process with HDL Flow's intuitive
              interface and powerful features."
          />
          <SimpleCard
            title="Cross-Platform Compatibility"
            subtitle="Access HDL Flow from anywhere, on any device, ensuring seamless
              collaboration."
          />
          <SimpleCard
            title="Code Generation"
            subtitle=" Automatically generate HDL code from your FSM diagrams, saving
            time and reducing errors."
          />
        </div>
      </div>
    </SimpleSection>
  );
}

export default Benefits;
