-- Add portalid to service table
ALTER TABLE service ADD COLUMN portalid UUID REFERENCES crm_portal(portalid);

-- Create an index for better query performance
CREATE INDEX idx_service_portalid ON service(portalid);

-- Add a comment to explain the relationship
COMMENT ON COLUMN service.portalid IS 'References the CRM portal this service belongs to'; 