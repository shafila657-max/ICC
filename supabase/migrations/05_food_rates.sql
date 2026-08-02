-- =============================================
-- Migration: Add food_rates table for admin-managed donation menu
-- =============================================

CREATE TABLE IF NOT EXISTS food_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  per_child_cost DECIMAL(10,2) NOT NULL CHECK (per_child_cost > 0),
  total_cost DECIMAL(10,2) NOT NULL CHECK (total_cost > 0),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table for student count and other config
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default student count
INSERT INTO site_settings (key, value) VALUES ('student_count', '150')
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE food_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all food_rates" ON food_rates;
CREATE POLICY "Allow all food_rates" ON food_rates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all site_settings" ON site_settings;
CREATE POLICY "Allow all site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- Seed default food rates
INSERT INTO food_rates (item_name, per_child_cost, total_cost, sort_order) VALUES
  ('രാവിലെ സാധാ ചായ കടി (നാസ്ത)', 30, 4500, 1),
  ('രാവിലെ പൊറോട്ട, ചിക്കൻ', 45, 6750, 2),
  ('ഉച്ചഭക്ഷണം ഫിഷ്കറി, സാധാ ചോറ്', 33, 4950, 3),
  ('ഇറച്ചിക്കറി, സാധാ ചോറ്', 40, 6000, 4),
  ('ചിക്കൻ ഉപ്പേരിച്ചത്, സാധാ ചോറ്', 55, 8250, 5),
  ('ഇറച്ചി വറട്ട്, സാധാ ചോറ്', 58, 8700, 6),
  ('ഇറച്ചിക്കറി, തേങ്ങാചോറ്', 50, 7500, 7),
  ('ബീഫ് ബിരിയാണി', 85, 12750, 8),
  ('ചിക്കൻ ബിരിയാണി', 80, 12000, 9),
  ('മന്തി', 80, 12000, 10),
  ('ബീഫ്, നെയ്ച്ചോറ്', 75, 11250, 11),
  ('ചിക്കൻ, നെയ്ച്ചോറ്', 70, 10500, 12),
  ('വൈകുന്നേരം ചായ, കടി', 17, 2550, 13),
  ('പായസം', 10, 1500, 14),
  ('ഒരു ദിവസത്തെ സാധാ ഭക്ഷണം', 120, 18000, 15)
ON CONFLICT DO NOTHING;
