-- SCRIPT FINAL PARA SUPABASE
-- Copia y pega TODO en el SQL Editor de Supabase

-- 1. Agregar clave primaria
ALTER TABLE public.inventario_fisico ADD PRIMARY KEY (placa);

-- 2. Crear índices  
CREATE INDEX idx_regional_centro ON public.inventario_fisico (regional, centro);
CREATE INDEX idx_ambiente ON public.inventario_fisico (ambiente);
CREATE INDEX idx_modulo ON public.inventario_fisico (modulo);

-- 3. Habilitar seguridad
ALTER TABLE public.inventario_fisico ENABLE ROW LEVEL SECURITY;

-- 4. Permitir acceso público
CREATE POLICY "allow_all" ON public.inventario_fisico FOR ALL USING (true) WITH CHECK (true);

-- 5. Verificar resultado
SELECT 
    (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = 'inventario_fisico' AND constraint_type = 'PRIMARY KEY') as clave_primaria,
    (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'inventario_fisico') as indices_creados,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'inventario_fisico') as politicas_creadas;
