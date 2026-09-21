-- CM de Poche — La bio Instagram fait partie de l'analyse de marque (R9)
-- Intégrée au diagnostic : texte de bio + lecture (clarté, positionnement, besoin d'optim).
-- Alimente le brand_brain, affichée et corrigeable à l'écran de confirmation.

alter table brand_brain add column if not exists bio_text       text;   -- texte brut de la bio
alter table brand_brain add column if not exists bio_diagnostic text;   -- lecture IA de la bio
