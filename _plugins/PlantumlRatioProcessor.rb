module Jekyll
    class PlantumlRatioProcessor

      Jekyll::Hooks.register :site, :post_write do |site|
        # Traverse all HTML files in the output directory (_site/)
        Dir.glob(File.join(site.dest, "**/*.html")) do |html_file|
          process_html_file(html_file)
        end
      end
  
      def self.process_html_file(file_path)
        # Read the HTML content from the file
        Jekyll.logger.debug self.marker, "Processing #{file_path}"
        content = File.read(file_path)
        doc = Nokogiri::HTML(content)
  
        # Process SVGs or other elements in the document
        doc.css('svg.plantuml').each do |svg|
          process_svg(svg, doc)
        end
  
        # Save the modified HTML back to the same file
        File.write(file_path, doc.to_html)
        Jekyll.logger.debug self.marker, "Processed #{file_path}"
      end
  
      def self.process_svg(svg, doc)
        # SVG processing logic
        wrapper = Nokogiri::XML::Node.new('div', doc)
        wrapper['class'] = 'plantuml-wrapper'  # Add a class to the wrapper div

        # Insert the SVG into the wrapper
        svg.add_previous_sibling(wrapper)
        wrapper.add_child(svg)
        Jekyll.logger.debug self.marker, "Added wrapper div to PlantUML diagram"
      end

      def self.marker()
        return PlantumlRatioProcessor.name
      end
    end
  end