module Jekyll
    class FixAriaAnchor

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
        doc.css('a.anchor').each do |anchor|
          process_anchor(anchor)
        end
  
        # Save the modified HTML back to the same file
        Jekyll.logger.debug self.marker, "Processed #{file_path}"
        File.write(file_path, doc.to_html)
      end
  
      def self.process_anchor(anchor)
        # Insert the SVG into the wrapper
        anchor['aria-hidden'] = 'false'
        anchor['aria-label'] = anchor.parent.text.strip
        Jekyll.logger.debug self.marker, "Added aria metadata to anchor element"
      end

      def self.marker()
        return PlantumlRatioProcessor.name
      end
    end
  end