import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCredential extends Struct.ComponentSchema {
  collectionName: 'components_shared_credentials';
  info: {
    description: 'A credential or badge earned from a course';
    displayName: 'Credential';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_buttons';
  info: {
    displayName: 'CTA Button';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['cta', 'cta-ghost']> &
      Schema.Attribute.DefaultTo<'cta'>;
  };
}

export interface SharedDetailItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_detail_items';
  info: {
    description: 'A label/value pair for course details (duration, level, etc.)';
    displayName: 'Detail Item';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_columns';
  info: {
    displayName: 'Footer Column';
    icon: 'layout';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.footer-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_links';
  info: {
    displayName: 'Footer Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFormField extends Struct.ComponentSchema {
  collectionName: 'components_shared_form_fields';
  info: {
    description: 'A dynamic form field definition for course registration forms';
    displayName: 'Form Field';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    options: Schema.Attribute.Text;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<
      ['text', 'url', 'email', 'number', 'select', 'textarea', 'checkbox']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface SharedHeroButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_buttons';
  info: {
    displayName: 'Hero Button';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'outline', 'ghost']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedInitiative extends Struct.ComponentSchema {
  collectionName: 'components_shared_initiatives';
  info: {
    displayName: 'Initiative';
    icon: 'rocket';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMilestone extends Struct.ComponentSchema {
  collectionName: 'components_shared_milestones';
  info: {
    displayName: 'Milestone';
    icon: 'clock';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_links';
  info: {
    displayName: 'Nav Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedResultCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_result_cards';
  info: {
    displayName: 'Result Card';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'earth';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    platform: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStatItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_items';
  info: {
    displayName: 'Stat Item';
    icon: 'chart-bar';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    labelHighlight: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTrainingModule extends Struct.ComponentSchema {
  collectionName: 'components_shared_training_modules';
  info: {
    displayName: 'Training Module';
    icon: 'book';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedValueItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_value_items';
  info: {
    displayName: 'Value Item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.credential': SharedCredential;
      'shared.cta-button': SharedCtaButton;
      'shared.detail-item': SharedDetailItem;
      'shared.footer-column': SharedFooterColumn;
      'shared.footer-link': SharedFooterLink;
      'shared.form-field': SharedFormField;
      'shared.hero-button': SharedHeroButton;
      'shared.initiative': SharedInitiative;
      'shared.milestone': SharedMilestone;
      'shared.nav-link': SharedNavLink;
      'shared.result-card': SharedResultCard;
      'shared.social-link': SharedSocialLink;
      'shared.stat-item': SharedStatItem;
      'shared.training-module': SharedTrainingModule;
      'shared.value-item': SharedValueItem;
    }
  }
}
